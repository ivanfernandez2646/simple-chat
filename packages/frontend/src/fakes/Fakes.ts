import { faker } from "@faker-js/faker";
import Repeater from "./Repeater";
import { User } from "../types/entities/User";
import { ChatWrapper } from "../types/helpers/ChatWrapper";

//TODO: update all fakes (conversations, messages...)
export const fakedLoggedUser: User = {
  id: faker.string.uuid(),
  name: faker.person.firstName(),
  surname: faker.person.lastName(),
  photoUrl: faker.image.urlPicsumPhotos(),
  bioStatus: faker.word.words(),
  createdAt: faker.date.recent(),
};

export function randomUser(): User {
  return {
    id: faker.string.uuid(),
    name: faker.person.firstName(),
    surname: faker.person.lastName(),
    photoUrl: faker.image.urlPicsumPhotos(),
    bioStatus: faker.word.words(),
    createdAt: faker.date.recent(),
  };
}

function randomChatWrapper(): ChatWrapper {
  return {
    conversationId: faker.string.uuid(),
    otherUser: { ...randomUser(), isTyping: faker.datatype.boolean() },
    haveMessagesUnread: faker.datatype.boolean(),
    lastMessageHour: faker.date.recent(),
  };
}

export function randomChatsWrappers(): ChatWrapper[] {
  return Repeater.random(randomChatWrapper, 5);
}
