import { makeAutoObservable, runInAction } from "mobx";
import { toast } from "react-toastify";
import { StatusCodes } from "http-status-codes";
import { API, GETHeader, POSTFormHeader } from "../utils/api";
import { Schema } from "../entities/schema";
import { TOAST_PROPS } from "../utils/constants";

class SchemaStore {
  isLoading: boolean = false;
  schemas: Schema[] = [];
  deletedSchemas: Schema[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  async uploadSchema(formData: FormData) {
    this.setIsLoading(true);
    try {
      const r = await API.post("/schemas/upload", formData, {
        headers: POSTFormHeader,
      });
      if (r.status === StatusCodes.OK) {
        toast.success("Schema uploaded successfully", {
          hideProgressBar: true,
        });
        await this.getSchemas();
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

  async updateSchema(formData: FormData, schemaId: number) {
    this.setIsLoading(true);
    try {
      const r = await API.put(`/schemas/update/${schemaId}`, formData, {
        headers: POSTFormHeader,
      });
      if (r.status === StatusCodes.OK) {
        toast.success("Schema updated successfully", { hideProgressBar: true });
        await this.getSchemas();
      }
    } catch (e: any) {
      if (e && e.response.status === 400) {
        toast.error(e.response.data, TOAST_PROPS);
      } else {
        console.error("An error occurred:", e);
      }
      this.setIsLoading(false);
      return false;
    }
  }

  async deleteSchema(schemaId: number) {
    this.setIsLoading(true);
    try {
      const r = await API.delete(`/schemas/delete/${schemaId}`, {
        headers: GETHeader,
      });
      if (r.status === StatusCodes.OK) {
        toast.success("Schema archived successfully", {
          hideProgressBar: true,
        });
        await this.getSchemas();
      }
    } catch (error) {
      toast.error("Something went wrong", { hideProgressBar: true });
    } finally {
      this.setIsLoading(false);
    }
  }

  async restoreSchema(schemaId: number, version: number) {
    this.setIsLoading(true);
    try {
      const r = await API.put(
        `/schemas/restore/${schemaId}/to/${version}`,
        {},
        { headers: GETHeader }
      );
      if (r.status === StatusCodes.OK) {
        toast.success("Schema updated successfully", { hideProgressBar: true });
        await this.getSchemas();
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", { hideProgressBar: true });
    } finally {
      this.setIsLoading(false);
    }
  }

  async getSchemas() {
    this.setIsLoading(true);
    try {
      const response = await API.get("/schemas", { headers: GETHeader });
      this.setSchemas(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    } finally {
      this.setIsLoading(false);
    }
  }

  async getDeletedSchemas() {
    this.setIsLoading(true);
    try {
      const response = await API.get("/schemas/deleted", {
        headers: GETHeader,
      });
      this.setDeletedSchemas(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      this.setIsLoading(false);
    }
  }

  setDeletedSchemas(deletedSchemas: Schema[]) {
    runInAction(() => {
      this.deletedSchemas = deletedSchemas;
    });
  }

  setIsLoading(value: boolean) {
    runInAction(() => {
      this.isLoading = value;
    });
  }

  setSchemas(value: Schema[]) {
    runInAction(() => {
      this.schemas = value;
    });
  }
}

export default new SchemaStore();
