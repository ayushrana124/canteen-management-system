export interface CreateCanteenDTO {
  name: string;
  location: string;
  managerId: string;
}

export interface GetCanteensQueryDTO {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "createdAt" | "name";
  order?: "asc" | "desc";
}

export interface UpdateCanteenDTO {
  name?: string;
  location?: string;
};


