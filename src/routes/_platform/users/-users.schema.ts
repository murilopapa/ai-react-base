import { z } from 'zod';

export const GeoSchema = z.object({
  lat: z.string(),
  lng: z.string(),
});

export const AddressSchema = z.object({
  street: z.string(),
  suite: z.string(),
  city: z.string(),
  zipcode: z.string(),
  geo: GeoSchema,
});

export const CompanySchema = z.object({
  name: z.string(),
  catchPhrase: z.string(),
  bs: z.string(),
});

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  email: z.string(),
  address: AddressSchema,
  phone: z.string(),
  website: z.string(),
  company: CompanySchema,
});

export const UsersResponseSchema = z.array(UserSchema);

export const UserPostSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  body: z.string(),
});

export const UserPostsResponseSchema = z.array(UserPostSchema);

export const UserAlbumSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
});

export const UserAlbumsResponseSchema = z.array(UserAlbumSchema);

export type User = z.infer<typeof UserSchema>;
export type UserPost = z.infer<typeof UserPostSchema>;
export type UserAlbum = z.infer<typeof UserAlbumSchema>;
