import Ajv from 'ajv';
import { StatusCodes } from 'http-status-codes';
import { injectable, inject } from 'inversify';

import { AppError } from '@/errors/app.error';
import { Injection } from '@/injection';
import { BillingCodeType, BillingClass, PlanMarketType, TinType } from '@/modules/tic/constants';
import ticSchema from '@/modules/tic/json-schemas/tic.schema.json';
import { TicStore } from '@/modules/tic/tic.store';
import { InternalTiCData, TiC, TiCFile } from '@/modules/tic/types';
import { parseCsvFile } from '@/utils/parse-csv-file';

@injectable()
export class TicService {
  private ajv = new Ajv();

  constructor(@inject(Injection.TicStore) private readonly ticStore: TicStore) {}

  // Create an array of TiC rows from CSV data
  public async generateFromCSVFile(csv: File): Promise<TiCFile[]> {
    const parsedCsv = await parseCsvFile(csv);

    // Convert each row to internal interface representation and skip the header row
    const internalData: InternalTiCData[] = parsedCsv.table.map((row) => ({
      groupName: row['Group Name'],
      providerName: row['Provider Name'],
      plan: row['Plan'],
      planId: row['Plan ID'],
      placeOfService: row['Place of Service'],
      claimType: row['Claim Type'] as BillingClass,
      procedureCode: row['Procedure Code'],
      providerId: row['Provider ID'],
      allowed: parseFloat(row['Allowed']),
      billed: parseFloat(row['Billed']),
    }));

    // Convert each local row to TiC row and save to store
    const newTics = internalData.map(async (row) => {
      const ticRow = this.convertInternalTiCRowToTiCRow(row);
      return await this.ticStore.saveTicToFile(ticRow);
    });

    return Promise.all(newTics);
  }

  // Convert a local interface representation to a TiC row
  private convertInternalTiCRowToTiCRow(row: InternalTiCData): TiC {
    const ticRow: TiC = {
      reporting_entity_name: row.groupName,
      reporting_entity_type: PlanMarketType.GROUP,
      plan_name: row.plan,
      plan_id_type: 'plan_id',
      plan_id: row.planId,
      plan_market_type: PlanMarketType.GROUP,
      last_updated_on: new Date().toISOString().split('T')[0],
      version: '1.0',
      out_of_network: [
        {
          name: row.providerName,
          billing_code_type: BillingCodeType.CPT,
          billing_code_type_version: '2024',
          billing_code: row.procedureCode,
          description: row.placeOfService,
          allowed_amounts: [
            {
              tin: {
                type: TinType.EIN,
                value: row.providerId,
              },
              service_code: [],
              billing_class: row.claimType?.toLowerCase() as BillingClass,
              payments: [
                {
                  allowed_amount: row.allowed,
                  billing_code_modifier: [],
                  providers: [
                    {
                      billed_charge: row.billed,
                      npi: [parseInt(row.providerId, 10)],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    // Validate the generated TiC row using the schema
    const validate = this.ajv.compile(ticSchema);
    if (!validate(ticRow)) {
      throw new AppError('Invalid TiC row data', StatusCodes.BAD_REQUEST); // Throw error if validation fails
    }

    return ticRow;
  }
}
