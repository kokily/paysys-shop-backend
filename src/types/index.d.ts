export type TokenType = {
  iat: number;
  exp: number;
  iss: string;
  sub: string;
};

export type AccessTokenType = {
  user_id: string;
  username: string;
  admin: boolean;
} & TokenType;

export type RefreshTokenType = {
  user_id: string;
  username: string;
  admin: boolean;
  token_id: string;
} & TokenType;

export type FileType = {
  name: string;
  path: string;
  type: string;
};

export type S3ReturnType = {
  key: string;
  url: string;
};

export type S3ParamsType = {
  Bucket: string;
  Body: fs.ReadStream;
  Key: string;
  ContentType: string;
};
