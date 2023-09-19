const result = await productModel.paginate({}, {page, limit, sort});
products = result.docs.map((doc) => doc.toObject()); 