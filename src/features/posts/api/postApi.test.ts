import { describe, it, expect, vi, beforeEach } from "vitest";
import postApi from "./postApi";
import apiHelper from "../../../helpers/apiHelper";

describe("postApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("postPost", () => {
    it("should create new todo and return data", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { todo_id: 10 },
        }),
      });

      const res = await postApi.postPost("Title", "Description");
      expect(res).toEqual({ todo_id: 10 });
    });

    it("should throw error if creation fails", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Data tidak valid",
        }),
      });

      await expect(postApi.postPost("", "")).rejects.toThrow("Data tidak valid");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(postApi.postPost("", "")).rejects.toThrow("Gagal menambahkan todo");
    });
  });

  describe("postPostCover", () => {
    it("should upload cover with FormData and return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil mengubah cover",
        }),
      });

      const dummyFile = new File(["dummy"], "cover.jpg", { type: "image/jpeg" });
      const msg = await postApi.postPostCover(1, dummyFile);
      expect(msg).toBe("Berhasil mengubah cover");
    });

    it("should handle cover file without name property properly", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil",
        }),
      });

      const dummyBlob = new Blob(["dummy"], { type: "image/jpeg" });
      const msg = await postApi.postPostCover(1, dummyBlob);
      expect(msg).toBe("Berhasil");
    });

    it("should throw error on upload cover fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Format tidak didukung",
        }),
      });

      const dummyFile = new File(["dummy"], "cover.jpg");
      await expect(postApi.postPostCover(1, dummyFile)).rejects.toThrow(
        "Format tidak didukung"
      );
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      const dummyFile = new File(["dummy"], "cover.jpg");
      await expect(postApi.postPostCover(1, dummyFile)).rejects.toThrow(
        "Gagal mengubah cover"
      );
    });
  });

  describe("putPost", () => {
    it("should update todo and return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil mengubah data",
        }),
      });

      const msg = await postApi.putPost(1, "Updated", "Desc", true);
      expect(msg).toBe("Berhasil mengubah data");
    });

    it("should correctly handle boolean false for is_completed", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil mengubah data",
        }),
      });

      const msg = await postApi.putPost(1, "Updated", "Desc", false);
      expect(msg).toBe("Berhasil mengubah data");
    });

    it("should throw error on update failure", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Gagal update todo",
        }),
      });

      await expect(postApi.putPost(1, "", "", false)).rejects.toThrow("Gagal update todo");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(postApi.putPost(1, "", "", false)).rejects.toThrow("Gagal mengubah todo");
    });
  });

  describe("getPosts", () => {
    it("should fetch all todos without filter", async () => {
      const mockTodos = [{ id: 1, title: "Todo 1" }];
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { todos: mockTodos },
        }),
      });

      const todos = await postApi.getPosts();
      expect(todos).toEqual(mockTodos);
    });

    it("should fetch filtered todos when is_completed parameter provided", async () => {
      const mockTodos = [{ id: 2, title: "Todo 2", is_completed: 1 }];
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { todos: mockTodos },
        }),
      });

      const todos = await postApi.getPosts("1");
      expect(todos).toEqual(mockTodos);
    });

    it("should return empty array if data.posts is missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: {},
        }),
      });

      const todos = await postApi.getPosts();
      expect(todos).toEqual([]);
    });

    it("should throw error on fetch todos fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Akses tidak diizinkan",
        }),
      });

      await expect(postApi.getPosts()).rejects.toThrow("Akses tidak diizinkan");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(postApi.getPosts()).rejects.toThrow("Gagal mengambil data todo");
    });
  });

  describe("getPostById", () => {
    it("should return single todo object on success", async () => {
      const mockTodo = { id: 5, title: "Single" };
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { todo: mockTodo },
        }),
      });

      const res = await postApi.getPostById(5);
      expect(res).toEqual(mockTodo);
    });

    it("should throw error on detail fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Todo tidak ditemukan",
        }),
      });

      await expect(postApi.getPostById(999)).rejects.toThrow("Todo tidak ditemukan");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(postApi.getPostById(999)).rejects.toThrow("Gagal mengambil detail todo");
    });
  });

  describe("deletePost", () => {
    it("should delete todo and return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil menghapus data",
        }),
      });

      const msg = await postApi.deletePost(1);
      expect(msg).toBe("Berhasil menghapus data");
    });

    it("should throw error on delete fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Gagal menghapus",
        }),
      });

      await expect(postApi.deletePost(1)).rejects.toThrow("Gagal menghapus");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(postApi.deletePost(1)).rejects.toThrow("Gagal menghapus todo");
    });
  });
});
