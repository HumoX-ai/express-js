export default function (req, res, next) {
  console.log(req.cookies.token);
  if (req.cookies.token) {
    res.locals.token = true;
  }
  if (req.session.user) {
    res.locals.token = true;
  }
  next();
}
