import { makeAutoObservable, runInAction } from "mobx";
import { Model } from "../entities/model";
import { toast } from "react-toastify";
import { StatusCodes } from "http-status-codes";
import { API, GETHeader, POSTFormHeader } from "../utils/api";
import TagStore from "./TagStore";
import { TOAST_PROPS } from "../utils/constants";

class ModelStore {
  isLoading: boolean = false;
  models: Model[] = [];
  deletedModels: Model[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  getModelsByTags(filterTags: string[]) {
    const filteredModels = this.models.filter((model) =>
      model.tags.some((tag) => filterTags.includes(tag.name))
    );
    this.setModels(filteredModels);
  }

  async uploadModel(formData: FormData) {
    this.setIsLoading(true);
    try {
      const r = await API.post("/models/upload", formData, {
        headers: POSTFormHeader,
      });
      if (r.status === StatusCodes.OK) {
        toast.success("Model uploaded successfully", { hideProgressBar: true });
        await this.getModels();
        await TagStore.getTags();
        return true;
      }
    } catch (e: any) {
      if (e.response && e.response.status === 400) {
        toast.error(e.response.data, TOAST_PROPS);
      } else {
        console.error("An error occurred:", e);
      }
      this.setIsLoading(false);
      return false;
    }
  }

  async updateModel(formData: FormData, modelId: number) {
    this.setIsLoading(true);
    try {
      const r = await API.put(`/models/update/${modelId}`, formData, {
        headers: POSTFormHeader,
      });
      if (r.status === StatusCodes.OK) {
        toast.success("Model updated successfully", { hideProgressBar: true });
        await this.getModels();
        await TagStore.getTags();
        return true;
      }
    } catch (e: any) {
      if (e.response && e.response.status === 400) {
        toast.error(e.response.data, TOAST_PROPS);
      } else {
        console.error("An error occurred:", e);
      }
      this.setIsLoading(false);
      return false;
    }
  }

  async restoreModel(modelId: number, version: number) {
    this.setIsLoading(true);
    try {
      const r = await API.put(
        `/models/restore/${modelId}/to/${version}`,
        {},
        { headers: GETHeader }
      );
      if (r.status === StatusCodes.OK) {
        toast.success("Model updated successfully", { hideProgressBar: true });
        await this.getModels();
        await TagStore.getTags();
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", { hideProgressBar: true });
    } finally {
      this.setIsLoading(false);
    }
  }

  async markAsFavorite(modelId: number) {
    this.setIsLoading(true);
    try {
      const r = await API.put(
        `/models/favorite/${modelId}`,
        {},
        { headers: GETHeader }
      );
      if (r.status === StatusCodes.OK) {
        toast.success("Model updated successfully", { hideProgressBar: true });
        await this.getModels();
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", { hideProgressBar: true });
    } finally {
      this.setIsLoading(false);
    }
  }

  async restoreFromTrash(modelId: number) {
    this.setIsLoading(true);
    try {
      const r = await API.put(
        `/models/restoreFromTrash/${modelId}`,
        {},
        { headers: GETHeader }
      );
      if (r.status === StatusCodes.OK) {
        toast.success("Model restored successfully", { hideProgressBar: true });
        await this.getDeletedModels();
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", { hideProgressBar: true });
    } finally {
      this.setIsLoading(false);
    }
  }

  async deleteModel(modelId: number) {
    this.setIsLoading(true);
    try {
      const r = await API.delete(`/models/delete/${modelId}`, {
        headers: GETHeader,
      });
      if (r.status === StatusCodes.OK) {
        toast.success("Model archived successfully", { hideProgressBar: true });
        await this.getModels();
      }
    } catch (error) {
      toast.error("Something went wrong", { hideProgressBar: true });
    } finally {
      this.setIsLoading(false);
    }
  }

  async getModels() {
    this.setIsLoading(true);
    try {
      const response = await API.get("/models", { headers: GETHeader });
      const models: Model[] = response.data;
      models.sort(function compare(a, b) {
        var dateA = new Date(a?.updateDate || a.createDate).getTime();
        var dateB = new Date(b?.updateDate || b.createDate).getTime();
        return dateB - dateA;
      });
      this.setModels(models);
      return response.data;
    } catch (error) {
      console.error(error);
    } finally {
      this.setIsLoading(false);
    }
  }

  async getDeletedModels() {
    this.setIsLoading(true);
    try {
      const response = await API.get("/models/deleted", {
        headers: GETHeader,
      });
      this.setDeletedModels(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      this.setIsLoading(false);
    }
  }

  setDeletedModels(deletedModels: Model[]) {
    runInAction(() => {
      this.deletedModels = deletedModels;
    });
  }

  setIsLoading(value: boolean) {
    runInAction(() => {
      this.isLoading = value;
    });
  }

  setModels(value: Model[]) {
    runInAction(() => {
      this.models = value;
    });
  }
}

export default new ModelStore();
