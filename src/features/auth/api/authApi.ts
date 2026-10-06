import apiHelper from "../../../helpers/apiHelper";
import { DELCOM_BASEURL } from "@/lib/config";

const authApi = (() => {
  const BASE_URL = `${DELCOM_BASEURL}/auth`;

  function _url(path: string) {
    return BASE_URL + path;
  }

  async function postRegister(name: string, email: string, password: string) {
    const response = await apiHelper.fetchData(_url("/register"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal registrasi");
    }

    return result.message;
  }

  async function postLogin(email: string, password: string) {
    const response = await apiHelper.fetchData(_url("/login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal login");
    }

    return result.data;
  }

  return {
    postRegister,
    postLogin,
  };
})();

export default authApi;