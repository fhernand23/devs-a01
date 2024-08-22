import { StatusCodes } from "http-status-codes";
import { makeAutoObservable, runInAction } from "mobx";
import { toast } from "react-toastify";
import { TOAST_PROPS } from "../utils/constants";
import { API, GETHeader, POSTFormHeader } from "../utils/api";
import { Tag } from "../entities/tag";

class TagStore {
  isLoading: boolean = false;
  tags: Tag[] = [];
  adminTags: Tag[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  async getTags() {
    this.setIsLoading(true);
    try {
      const response = await API.get("/tags", { headers: GETHeader });
      this.setTags(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Error getting tags", TOAST_PROPS);
    } finally {
      this.setIsLoading(false);
    }
  }

  async getAdminTags() {
    this.setIsLoading(true);
    try {
      const response = await API.get("/tags/all", { headers: GETHeader });
      this.setAdminTags(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error("Error getting tags", TOAST_PROPS);
    } finally {
      this.setIsLoading(false);
    }
  }

  async uploadTag(formData: FormData) {
    this.setIsLoading(true);

    try {
      const r = await API.post("/tags/upload", formData, {
        headers: POSTFormHeader,
      });
      if (r.status === StatusCodes.OK) {
        toast.success("Tag uploaded successfully", { hideProgressBar: true });
        await this.getAdminTags();
      }
    } catch (error) {
      toast.error("Something went wrong", { hideProgressBar: true });
    } finally {
      this.setIsLoading(false);
    }
  }

  async updateTag(formData: FormData, tagId: number) {
    this.setIsLoading(true);
    try {
      const r = await API.put(`/tags/${tagId}`, formData, {
        headers: POSTFormHeader,
      });
      if (r.status === StatusCodes.OK) {
        toast.success("Tag updated successfully", { hideProgressBar: true });
        await this.getTags();
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", { hideProgressBar: true });
    } finally {
      this.setIsLoading(false);
    }
  }

  async deleteTag(tagId: number) {
    this.setIsLoading(true);
    try {
      const r = await API.delete(`/tags/${tagId}`, {
        headers: GETHeader,
      });
      if (r.status === StatusCodes.OK) {
        toast.success("Tag deleted successfully", { hideProgressBar: true });
        await this.getTags();
      }
    } catch (error) {
      toast.error("Something went wrong", { hideProgressBar: true });
    } finally {
      this.setIsLoading(false);
    }
  }

  setTags(tags: Tag[]) {
    runInAction(() => {
      this.tags = tags;
    });
  }

  setAdminTags(tags: Tag[]) {
    runInAction(() => {
      this.adminTags = tags;
    });
  }

  setIsLoading(value: boolean) {
    runInAction(() => {
      this.isLoading = value;
    });
  }
}

export default new TagStore();
