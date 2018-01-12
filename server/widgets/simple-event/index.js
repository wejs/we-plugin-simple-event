/**
 * Widget simple-event main file
 */

module.exports = function (projectPath, Widget) {
  const widget = new Widget('simple-event', __dirname);

  // // Override default widget class functions after instance
  //
  // widget.beforeSave = function widgetBeforeSave(req, res, next) {
  //   // do something after save this widget in create or edit ...
  //   return next();
  // };

  // // form middleware, use for get data for widget form
  // widget.formMiddleware = function formMiddleware(req, res, next) {
  //
  //   next();
  // }

  // // Widget view middleware, use for get data after render the widget html
  widget.viewMiddleware = function viewMiddleware(widget, req, res, next) {

    return req.we.db.models['simple-event']
    .findAll({
      where: { published: true },
      order: [
        ['highlighted', 'DESC'],
        ['eventStartDate', 'DESC']
      ],
      limit: 3
    })
    .then( (p)=> {
      widget.events = p;
      next();
      return null;
    })
    .catch(next);
  }

  return widget;
};