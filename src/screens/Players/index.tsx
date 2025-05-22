import { Button } from "@/src/components/Button";
import { ButtonIcon } from "@/src/components/ButtonIcon";
import { Filter } from "@/src/components/Filter";
import { Header } from "@/src/components/Header";
import { Highlight } from "@/src/components/Highlight";
import { Input } from "@/src/components/Input";
import { ListEmpty } from "@/src/components/ListEmpty";
import { PlayerCard } from "@/src/components/PlayerCard";
import { playerAddByGroup } from "@/src/storage/player/playerAddByGroup";
import { playersGetByGroup } from "@/src/storage/player/playersGetByGroup";
import { AppError } from "@/src/utils/AppError";
import { useRoute } from "@react-navigation/native";
import { useState } from "react";
import { Alert, FlatList } from "react-native";
import { Container, Form, HeaderList, NumbersOfPlayers } from "./styles";

type RouteParams = {
  group: string;
};

export function Players() {
  const [newPlayerName, setNewPlayerName] = useState("");
  const [team, setTeam] = useState("Time A");
  const [players, setPlayers] = useState([]);

  const route = useRoute();
  const { group } = route.params as RouteParams;

  async function handleAddPlayer() {
    try {
      if (newPlayerName.trim().length === 0) {
        throw new AppError("Informe o nome da pessoa para adicionar.");
      }

      const newPlayer = {
        name: newPlayerName,
        team,
      };
      await playerAddByGroup(newPlayer, group);
      const players = await playersGetByGroup(group);
      console.log(players);
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert("Nova pessoa", error.message);
      } else {
        console.log(error);
        Alert.alert("Nova pessoa", "Não foi possível adicionar");
      }
    }
  }

  return (
    <Container>
      <Header showBackButton />

      <Highlight title={group} subtitle="adicione a galera e separe os times" />

      <Form>
        <Input
          placeholder="Nome da pessoa"
          autoCorrect={false}
          onChangeText={setNewPlayerName}
        />

        <ButtonIcon icon="add" onPress={handleAddPlayer} />
      </Form>
      <HeaderList>
        <FlatList
          data={["Time A", "Time B"]}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Filter
              title={item}
              isActive={item === team}
              onPress={() => setTeam(item)}
            />
          )}
          horizontal
        />

        <NumbersOfPlayers>{players.length}</NumbersOfPlayers>
      </HeaderList>
      <FlatList
        data={players}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <PlayerCard onRemove={() => {}} name={item} />
        )}
        ListEmptyComponent={() => (
          <ListEmpty message="Não há pessoas nesse time." />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          { paddingBottom: 100 },
          players.length === 0 && { flex: 1 },
        ]}
      />

      <Button title="Remover turma" type="SECONDARY" />
    </Container>
  );
}
