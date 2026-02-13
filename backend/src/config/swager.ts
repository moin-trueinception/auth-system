import swaggerui from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import {Express} from "express";

export const setupSwagger = (app:Express) => {
    const swaggerPath = path.join(__dirname,"../../docs/openapi.yaml");
    const swaggerDocument = YAML.load(swaggerPath);

    app.use("/api-docs",swaggerui.serve,swaggerui.setup(swaggerDocument));
};