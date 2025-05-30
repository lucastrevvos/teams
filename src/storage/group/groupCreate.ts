import { AppError } from "@/src/utils/AppError";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GROUP_COLLECTION } from "../storageConfig";
import { groupsGetAll } from "./groupsGetAll";

export async function groupCreate(newGroup: string) {
  try {
    const storedGroups = await groupsGetAll();

    const groupAlreadyExists = storedGroups.includes(newGroup);

    const groupName = newGroup.trim().length === 0;

    if (groupName) {
      throw new AppError("Informe o nome da turma.");
    }

    if (groupAlreadyExists) {
      throw new AppError("Já existe um grupo cadastrado com esse nome.");
    }

    const storage = JSON.stringify([...storedGroups, newGroup]);

    await AsyncStorage.setItem(GROUP_COLLECTION, storage);
  } catch (error) {
    throw error;
  }
}
