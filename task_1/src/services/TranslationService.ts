interface ModelData {
  id: string;
  name: string;
  fields: Field[];
}

interface Field {
  name: string;
  type: string;
  defaultValue: string;
  validation: string;
  validationOptions?: {
    pattern?: string;
    enum?: string[];
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
  };
  mapping?: string;
}

export class TranslationService {
  static translateModel(model: ModelData): any {
    return {
      name: model.name,
      fields: model.fields.map((field) => ({
        name: field.name,
        type: this.translateFieldType(field.type),
        isPrimaryKey: field.type === "primary key",
        validation: this.translateValidation(field),
        defaultValue: field.defaultValue || null,
        ...(field.mapping ? { mapping: this.parseMapping(field.mapping) } : {}),
      })),
    };
  }

  static translateRoute(route: any): any {
    return {
      name: route.name,
      method: route.method,
      url: route.url,
      ...(route.flowData ? { flowData: route.flowData } : {}),
    };
  }

  private static translateFieldType(type: string): string {
    if (type === "primary key") {
      return "INTEGER";
    }

    const typeMap: { [key: string]: string } = {
      string: "STRING",
      "long text": "TEXT",
      integer: "INTEGER",
      double: "DOUBLE",
      "big number": "BIGINT",
      boolean: "BOOLEAN",
      date: "DATE",
      datetime: "DATETIME",
      uuid: "UUID",
      json: "JSON",
      mapping: "MAPPING",
    };
    return typeMap[type] || type.toUpperCase();
  }

  private static translateValidation(field: Field): any {
    if (!field.validation) return null;

    const validation: any = {
      type: field.validation,
    };

    if (field.validationOptions) {
      Object.assign(validation, field.validationOptions);
    }

    return validation;
  }

  private static parseMapping(mapping: string): Record<string, string> {
    try {
      return Object.fromEntries(
        mapping.split(",").map((pair) => {
          const [key, value] = pair.split(":");
          return [key.trim(), value.trim()];
        })
      );
    } catch (e) {
      return {};
    }
  }
}
