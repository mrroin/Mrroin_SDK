import * as sdkmrroin from "./";
import { throwError, concat, of } from "rxjs";
import {
  map,
  catchError,
  mergeMap,
  filter,
  merge,
  delay,
} from "rxjs/operators";

beforeEach(() => {
  Object.defineProperty(global, "window", {
    value: {
      location: {
        search: "",
        pathname: "",
      },
    },
    writable: true,
  });
  sdkmrroin.initialize(
    "organizationID",
    "apikey",
    "userClient",
    "passwordClient",
    console.log,
  );
});

afterEach(() => {
  console.debug("end");
});
test("hello", () => {
  expect(sdkmrroin.getInstance("id").hello("foo")).toEqual("Hello foo");
});
