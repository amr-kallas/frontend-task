export type LoginPayload = {
  username: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

export type Session = {
  username: string;
  expiresAt: Date;
};
