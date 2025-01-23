import fs from 'fs';
import yaml from 'yaml';

type ServiceConfig = {
  networks?: string[];
};

type NetworkConfig = {
  name?: string;
  external?: boolean;
  driver?: string;
};

type ParsedYaml = {
  services: Record<string, ServiceConfig>;
  networks?: Record<string, NetworkConfig>;
};

export const isComposeOk = (composePath: string, app: string) => {
  const fileContent = fs.readFileSync(composePath, 'utf8');
  const parsedYaml: ParsedYaml = yaml.parse(fileContent);

  if (!parsedYaml.services) {
    console.log('Invalid Docker Compose file: No services found.');
    return false;
  }

  if (!parsedYaml.networks || !parsedYaml.networks[app]) {
    console.log(`Network "${app}" is not defined in the Docker Compose file.`);
    return false;
  }

  const appNetwork = parsedYaml.networks[app];
  if (!appNetwork.external || appNetwork.external !== true) {
    console.log(
      `Network "${app}" must be marked as "external: true" in the Docker Compose file.`
    );
    return false;
  }

  for (const [serviceName, serviceConfig] of Object.entries(
    parsedYaml.services
  )) {
    const networks = serviceConfig.networks || [];
    if (!networks.includes(app)) {
      console.log(
        `Service "${serviceName}" does not use the required network "${app}".`
      );
      return false;
    }
  }

  return true;
};
