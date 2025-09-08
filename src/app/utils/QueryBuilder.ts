import { Query } from "mongoose";
import { excludedFields } from "./constants";

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, string>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  //finding items by matching document's fields
  filter(): this {
    const filter = { ...this.query };
    for (const field of excludedFields) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete filter[field];
    }

    Object.keys(filter).forEach((item) => {
      if (filter[item] === "") {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete filter[item];
      }
    });

    this.modelQuery = this.modelQuery.find(filter);
    return this;
  }

  search(searchableFields: string[]): this {
    const searchTerm = this.query.searchTerm || "";
    const searchObject = {
      $or: searchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    };

    this.modelQuery = this.modelQuery.find(searchObject);
    return this;
  }

  sort(): this {
    const sort = this.query.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  populate(): this {
    const populate = this.query.populate || "";
    this.modelQuery = this.modelQuery.populate(populate);
    return this;
  }

  fields(): this {
    const fields = this.query.fields?.split(",").join(" ") || " ";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  paginate(): this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  async getMeta() {
    const alldocuments = await this.modelQuery.model.countDocuments();
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 2;
    const totalPage = Math.ceil(alldocuments / limit);
    return { total: alldocuments, totalPage, page, limit };
  }

  build() {
    return this.modelQuery;
  }
}
