import Cookies from "js-cookie";
import { TOKEN_KEY } from "@utility/constants";

const token = Cookies.get(TOKEN_KEY);
const additionalRequestHeaders = {
  Authorization: token ? `Bearer ${token}` : "",
};

export default additionalRequestHeaders;
