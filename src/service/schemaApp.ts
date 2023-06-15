export const schemaWallet = {
  title: "wallet schema",
  version: 0,
  description: "describes a wallet",
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    value: {
      type: "string",
    },
  },
  required: ["id", "value"],
  encrypted: ["secret"],
  attachments: {
    encrypted: true,
  },
};
export const schemaSession = {
  title: "session schema",
  version: 0,
  description: "describes info session",
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    userName: {
      type: "string",
    },
    organization: {
      type: "string",
    },
    logoOrganization: {
      type: "string",
    },
    identityProvider: {
      type: "string",
    },
  },
  required: ["id", "userName", "organization", "identityProvider"],
  encrypted: ["secret"],
  attachments: {
    encrypted: true,
  },
};
export const schemaApplication = {
  title: "application schema",
  version: 0,
  description: "describes a application",
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    value: {
      type: "string",
    },
  },
  required: ["id", "value"],
  encrypted: ["secret"],
  attachments: {
    encrypted: true,
  },
};
export const schemaConfiguration = {
  title: "configuration schema",
  version: 0,
  description: "describes a configuration",
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    value: {
      type: "string",
    },
  },
  required: ["id", "value"],
  encrypted: ["secret"],
  attachments: {
    encrypted: true,
  },
};

export const schemaCategory = {
  title: "category schema",
  version: 0,
  description: "index category",
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    value: {
      type: "string",
    },
  },
  required: ["id", "value"],
  encrypted: ["secret"],
  attachments: {
    encrypted: true,
  },
};

export const schemaDocument = {
  title: "document schema",
  version: 0,
  description: "index document",
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    value: {
      type: "string",
    },
  },
  required: ["id", "value"],
  encrypted: ["secret"],
  attachments: {
    encrypted: true,
  },
};
