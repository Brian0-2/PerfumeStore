import { Model, ModelStatic, FindAndCountOptions } from "sequelize";

interface PaginateOptions {
  page?: number;
  perPage?: number;
  attributes?: FindAndCountOptions['attributes'];
  include?: FindAndCountOptions['include'];
  where?: FindAndCountOptions['where'];
  order?: FindAndCountOptions['order'];
}

export const paginate = async <T extends Model>(
  model: ModelStatic<T>,
  options: PaginateOptions
) => {
  const page = options.page || 1;
  const perPage = options.perPage || 10;
  const offset = (page - 1) * perPage;

  const { count: total, rows: data } = await model.findAndCountAll({
    attributes: options.attributes,
    include: options.include,
    where: options.where,
    order: options.order || [['createdAt', 'DESC']],
    limit: perPage,
    offset,
    ...options
  });

  const lastPage = Math.ceil(total / perPage);

  return {
    data,
    meta: {
      total,
      per_page: perPage,
      current_page: page,
      last_page: lastPage,
      from: offset + 1,
      to: offset + data.length
    }
  };
};
