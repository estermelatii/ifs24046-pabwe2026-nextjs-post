import apiHelper from "../../../helpers/apiHelper";
import { DELCOM_BASEURL } from "@/lib/config";

const postApi = (() => {
  const BASE_URL = `${DELCOM_BASEURL}/posts`;

  function _url(path: string) {
    return BASE_URL + path;
  }

  async function postPost(description: string) {
    const response = await apiHelper.fetchData(_url("/"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description }),
    });
    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal menambahkan post");
    }
    return result.data;
  }

  async function postPostCover(postId: number | string, cover: File) {
    const formData = new FormData();
    formData.append("cover", cover, cover.name || "cover.jpg");
    const response = await apiHelper.fetchData(_url(`/${postId}/cover`), {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengubah cover");
    }
    return result.message;
  }

  async function putPost(postId: number | string, description: string) {
    const response = await apiHelper.fetchData(_url(`/${postId}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description }),
    });
    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengubah post");
    }
    return result.message;
  }

  // Semua post (tanpa is_me) agar data semua user tampil
  async function getPosts(is_me?: string | number) {
    const qs =
      is_me !== undefined && is_me !== "" && is_me !== null
        ? `/?is_me=${is_me}`
        : "/";
    const response = await apiHelper.fetchData(_url(qs), { method: "GET" });
    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengambil data post");
    }
    return result.data?.posts || [];
  }

  async function getPostById(postId: number | string) {
    const response = await apiHelper.fetchData(_url(`/${postId}`), {
      method: "GET",
    });
    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengambil detail post");
    }
    return result.data?.post || result.data;
  }

  async function deletePost(postId: number | string) {
    const response = await apiHelper.fetchData(_url(`/${postId}`), {
      method: "DELETE",
    });
    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal menghapus post");
    }
    return result.message;
  }

  async function postLike(postId: number | string, like: 0 | 1) {
    const response = await apiHelper.fetchData(_url(`/${postId}/likes`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ like }),
    });
    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengubah like");
    }
    return result.message;
  }

  async function postComment(postId: number | string, comment: string) {
    const response = await apiHelper.fetchData(_url(`/${postId}/comments`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment }),
    });
    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal menambah komentar");
    }
    return result.message;
  }

  async function deleteComment(postId: number | string) {
    const response = await apiHelper.fetchData(_url(`/${postId}/comments`), {
      method: "DELETE",
    });
    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal menghapus komentar");
    }
    return result.message;
  }

  return {
    postPost,
    postPostCover,
    putPost,
    getPosts,
    getPostById,
    deletePost,
    postLike,
    postComment,
    deleteComment,
  };
})();

export default postApi;
