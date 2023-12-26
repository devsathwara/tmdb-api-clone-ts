import express, {
  NextFunction,
  Request,
  Response,
  Router,
  request,
} from "express";
import { displayMoviesbyPages } from "../controllers/moviesContoller";

const router: Router = express.Router();

router.get(
  "/search-movie-pagenumber/:pagenumber",
  async (req: Request, res: Response) => {
    const pageNumber: number = parseInt(req.params.pagenumber);
    if (!pageNumber || isNaN(pageNumber)) {
      return res.status(400).send({ error: "Invalid page number!" });
    }
    const moviesData = await displayMoviesbyPages(pageNumber);
    if (moviesData) {
      return res.json({ page: pageNumber, Movies: moviesData });
    }
  }
);

export default router;
