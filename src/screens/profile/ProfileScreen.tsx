import React from "react";
import {
  HStack,
  Text,
  Heading,
  Avatar,
  VStack,
  Link,
  Icon,
  Pressable,
  Divider,
  Button,
  ButtonText,
  AvatarFallbackText,
  AvatarImage,
  LinkText,
} from "../../../components/ui";
import {
  Blinds,
  ChevronRight,
  Settings,
  Tablets,
  User,
  MessageCircleQuestionIcon,
  HeadsetIcon,
} from "lucide-react-native";
import { ScrollView } from "react-native";
import LogoutAlertDialog from "./LogoutAlertDialog";

const ProfileScreen = ({ isActive }: any) => {
  console.log("Profile")
  const [openLogoutAlertDialog, setOpenLogoutAlertDialog] =
    React.useState(false);
  return (
    // <Text>Profile</Text>
    <ScrollView >
      <VStack className="px-5 py-4 flex-1" space="lg">
        <Heading className="mb-1">Profile</Heading>
        <ProfileCard />
        <Divider className="my-2" />
        <PersonalInfoSection />
        <Divider className="my-2" />
        <HostingSection />
        <Divider className="my-2" />
        <SupportSection />
        <Divider className="my-2" />
        <LogoutButton
          openLogoutAlertDialog={openLogoutAlertDialog}
          setOpenLogoutAlertDialog={setOpenLogoutAlertDialog}
        />
      </VStack>
      <LogoutAlertDialog
        setOpenLogoutAlertDialog={setOpenLogoutAlertDialog}
        openLogoutAlertDialog={openLogoutAlertDialog}
      />
      </ScrollView>
  );
};

const ProfileCard = () => {
  return (
    <HStack className="justify-between items-center">
      <HStack space="md">
        <Avatar className="bg-primary-500">
          <AvatarFallbackText>Fuad Agus Salim</AvatarFallbackText>
          <AvatarImage
            source={{
              uri: "https://fuadagus.netlify.app/assets/img/about/about-1.jpg",
            }}
          />
        </Avatar>
        <VStack>
          <Text>Fuad Agus Salim</Text>
          <Link>
            <LinkText
              size="sm"
              className="text-typography-500 no-underline hover:text-typography-500 active:text-typography-500"
            >
              Lihat Profil
            </LinkText>
          </Link>
        </VStack>
      </HStack>
      <Pressable>
        <Icon as={ChevronRight} />
      </Pressable>
    </HStack>
  );
};

const PersonalInfoSection = () => {
  return (
    <VStack space="lg">
      <HStack className="justify-between">
        <HStack space="md">
          <Icon as={User} />
          <Text>Personal Info</Text>
        </HStack>
        <Pressable>
          <Icon as={ChevronRight} />
        </Pressable>
      </HStack>
      <HStack className="justify-between">
        <HStack space="md">
          <Icon as={Settings} />
          <Text>Account</Text>
        </HStack>
        <Pressable>
          <Icon as={ChevronRight} />
        </Pressable>
      </HStack>
    </VStack>
  );
};

const HostingSection = () => {
  return (
    <VStack space="lg">
      <Heading className="mb-1">Hosting</Heading>
      <HStack className="justify-between">
        <HStack space="md">
          <Icon as={Blinds} />
          <Text>Host a home</Text>
        </HStack>
        <Pressable>
          <Icon as={ChevronRight} />
        </Pressable>
      </HStack>
      <HStack className="justify-between">
        <HStack space="md">
          <Icon as={Tablets} />
          <Text>Host an experience</Text>
        </HStack>
        <Pressable>
          <Icon as={ChevronRight} />
        </Pressable>
      </HStack>
    </VStack>
  );
};

const SupportSection = () => {
  return (
    <VStack space="lg">
      <Heading className="mb-1">Support</Heading>
      <HStack className="justify-between">
        <HStack space="md">
          <Icon as={MessageCircleQuestionIcon} />
          <Text>Get Help</Text>
        </HStack>
        <Pressable>
          <Icon as={ChevronRight} />
        </Pressable>
      </HStack>
      <HStack className="justify-between">
        <HStack space="md">
          <Icon as={HeadsetIcon} />
          <Text>Contact Support</Text>
        </HStack>
        <Pressable>
          <Icon as={ChevronRight} />
        </Pressable>
      </HStack>
    </VStack>
  );
};

const LogoutButton = ({ setOpenLogoutAlertDialog }: any) => {
  return (
    <Button
      action="secondary"
      variant="outline"
      onPress={() => {
        setOpenLogoutAlertDialog(true);
      }}
    >
      <ButtonText>Logout</ButtonText>
    </Button>
  );
};

export default ProfileScreen;