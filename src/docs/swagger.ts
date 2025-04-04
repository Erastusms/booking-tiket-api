import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { Application } from 'express';
import { merge } from 'lodash';
import path from 'path';
import glob from 'glob';

export const setupSwagger = (app: Application) => {
  // Path absolut ke folder docs
  const docsPath = path.join(__dirname, '**/*.yaml');

  // Ambil semua file YAML di subfolder sekaligus
  const yamlFiles = glob.sync(docsPath);

  let mergedDoc: any = {};

  // Temukan main.yaml untuk di-load pertama (info, server, tags)
  const mainFile = yamlFiles.find((f) => f.includes('main.yaml'));
  if (mainFile) {
    mergedDoc = YAML.load(mainFile);
  }

  // Load dan merge semua file selain main.yaml
  for (const file of yamlFiles) {
    if (file !== mainFile) {
      const doc = YAML.load(file);
      mergedDoc = merge(mergedDoc, doc);
    }
  }

  // Tampilkan API docs sesuai environment
  const docsPathUrl = process.env.SWAGGER_PATH || '/api-docs';
  app.use(docsPathUrl, swaggerUi.serve, swaggerUi.setup(mergedDoc));
};
