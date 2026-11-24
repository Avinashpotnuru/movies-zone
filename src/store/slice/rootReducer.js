import restApi from "../api/restApis";

const rootReducer = {
  [restApi.reducerPath]: restApi.reducer,
};

export default rootReducer;
