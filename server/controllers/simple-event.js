module.exports = {
  find(req, res) {
    if (!req.we.acl.canStatic('access_simple-event_unpublished', req.userRoleNames)) {
      res.locals.query.where.published = true;
    }

    const Op = req.we.Op;

    // default sort:
    if (!req.query.sort) {
      res.locals.query.order = [
        ['highlighted', 'DESC'],
        ['registrationStartDate', 'DESC'],
        ['publishedAt', 'DESC'],
        ['id', 'DESC']
      ];
    }

    if (req.query.q) {
      res.locals.query.where[Op.or] = {
        name: {
          [Op.like]: '%'+req.query.q+'%'
        },
        body: {
          [Op.like]: '%'+req.query.q+'%'
        }
      };
    }

    return res.locals.Model
    .findAndCountAll(res.locals.query)
    .then( (record)=> {
      res.locals.metadata.count = record.count;
      res.locals.data = record.rows;
      return res.ok();
    })
    .catch(res.queryError);
  },

  findOne(req, res, next) {
    if (!res.locals.data) return next();

    // check if can access contents unpublished
    if (!res.locals.data.published) {
      if (!req.we.acl.canStatic('access_simple-event_unpublished', req.userRoleNames)) {
        return res.forbidden();
      }
    }

    req.we.hooks.trigger('we:after:send:ok:response', {
      res: res, req: req
    }, (err)=> {
      if (err) return res.serverError(err);
      return res.ok();
    });
  },
};