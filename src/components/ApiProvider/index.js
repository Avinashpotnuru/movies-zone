import { Provider } from "react-redux";

import { store } from "@/store/store";

const ApiProvider = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

export default ApiProvider;
