import { Container, Group } from '@mantine/core';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-4">
      <Container size="lg">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} TiC. All rights reserved.</p>
          <Group className="flex gap-4">
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors focus:outline-none">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors focus:outline-none">
              Terms of Service
            </a>
          </Group>
        </div>
        <div className="mt-6 text-sm text-gray-400">
          TiC is committed to providing innovative solutions that empower businesses and individuals. Stay connected for the latest updates and resources. As part of the
          Transparency in Coverage (TiC) regulations, health insurers are required to publish their allowed amounts monthly in a machine-readable format. This challenge involves
          building a React application that facilitates the generation of these Machine-Readable Files (MRFs) from a CSV file containing claims data.
          <br />
          <a
            target="_blank"
            href="https://github.com/CMSgov/price-transparency-guide/tree/master/schemas/allowed-amounts"
            className="text-sm text-center text-blue-400 hover:text-blue-500 transition-colors focus:outline-none"
          >
            TiC Guide
          </a>
        </div>
      </Container>
    </footer>
  );
};
