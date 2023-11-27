import {response as res} from "express";

res.INTERNAL_SERVER_ERROR= function () {
  return this.status(500).json({
    error: 'error in server'
  });
}
