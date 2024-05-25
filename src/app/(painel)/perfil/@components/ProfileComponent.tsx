"use client";

import React, { useEffect, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { UserCircleIcon, PhotoIcon } from "@heroicons/react/24/solid";
import { db, storage } from "@/lib/firebaseConfig";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { personalInfoSchema } from "./schemas";
import InputComponent from "@/components/Input/InputComponent";
import { useFamily } from "@/context/FamilyContext";
import { toast } from "sonner";
import Image from "next/image";

const ProfileForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(personalInfoSchema),
  });

  const [profileImage, setProfileImage] = useState<File | null | any>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useFamily();

  useEffect(() => {
    setLoading(true);
    if (user) {
      const loadUserData = async () => {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          reset(userData);
          setValue("email", user.email);
          setProfileImageUrl(userData.profileImageUrl || "");
          setCoverImageUrl(userData.coverImageUrl || "");
          setLoading(false);
        }
      };
      loadUserData();
    }
  }, [reset, user]);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<File | null>>,
    setUrl: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async (
    file: File,
    path: string
  ): Promise<string> => {
    const storageRef = ref(storage, path);
    try {
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("Failed to upload file.");
    }
  };

  const onSubmit = async (data: any) => {
    if (!user) {
      toast.error("User not authenticated.");
      return;
    }

    try {
      const profileImageUrlUpload = profileImage
        ? await handleImageUpload(profileImage, `profileImages/${user.uid}`)
        : profileImageUrl;
      const coverImageUrlUpload = coverImage
        ? await handleImageUpload(coverImage, `coverImages/${user.uid}`)
        : coverImageUrl;

      await setDoc(doc(db, "users", user.uid), {
        ...data,
        email: user.email, 
        profileImageUrl: profileImageUrlUpload,
        coverImageUrl: coverImageUrlUpload,
      });

      toast.success("Perfil salvo com sucesso!");
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast.error("Failed to save profile. Please try again.");
    }
  };

  return (
    <div className="space-y-10 divide-y divide-gray-900/10">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {loading ? (
          <div className="space-y-10 divide-y divide-gray-900/10">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
                <div className="px-4 sm:px-0">
                  <div className="h-6 bg-gray-300 rounded-md pulse"></div>
                  <div className="mt-1 h-4 bg-gray-200 rounded-md pulse"></div>
                </div>

                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                  <div className="px-4 py-6 sm:p-8">
                    <div className="grid max-w-full grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      {/* Skeletons for input fields */}
                      {Array.from({ length: 8 }, (_, index) => (
                        <div
                          key={index}
                          className="col-span-3 h-10 bg-gray-200 rounded-md pulse"
                        ></div>
                      ))}

                      {/* Large text area skeleton */}
                      <div className="col-span-full h-24 bg-gray-200 rounded-md pulse"></div>

                      {/* Profile image skeleton */}
                      <div className="col-span-full flex items-center gap-x-3">
                        <div className="h-12 w-12 bg-gray-300 rounded-full pulse"></div>
                        <div className="h-10 w-32 bg-gray-200 rounded-md pulse"></div>
                      </div>

                      {/* Cover photo skeleton */}
                      <div className="col-span-full mt-2 flex justify-center">
                        <div className="h-24 w-full bg-gray-200 rounded-lg border border-dashed border-gray-900/25 pulse"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end pr-8">
                    <div className="w-64 h-10 bg-primary rounded-md pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
            <div className="px-4 sm:px-0">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Perfil de Usuário
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Aqui será possível visualizar e alterar suas informações de
                usuário
              </p>
            </div>

            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
              <div className="px-4 py-6 sm:p-8">
                <div className="grid max-w-full grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <InputComponent
                    inputMode="text"
                    type="text"
                    className="col-span-3"
                    control={control}
                    name="firstName"
                    label="Nome"
                    error={errors.firstName}
                    placeholder="Enter your first name"
                  />
                  <InputComponent
                    inputMode="text"
                    type="text"
                    className="col-span-3"
                    control={control}
                    name="lastName"
                    label="Sobrenome"
                    error={errors.lastName}
                    placeholder="Enter your last name"
                  />
                  <InputComponent
                    inputMode="text"
                    type="text"
                    className="col-span-4"
                    label="Email"
                    disabled
                    control={control}
                    name="email"
                    error={errors.email}
                    placeholder="Enter your email address"
                  />
                  <div className="col-span-2"></div>
                  <InputComponent
                    inputMode="text"
                    type="text"
                    control={control}
                    name="streetAddress"
                    className="col-span-2"
                    label="Endereço"
                    error={errors.streetAddress}
                    placeholder="Enter your street address"
                  />
                  <InputComponent
                    inputMode="text"
                    type="text"
                    control={control}
                    name="city"
                    className="col-span-2"
                    label="City"
                    error={errors.city}
                    placeholder="Enter your city"
                  />
                  <InputComponent
                    inputMode="text"
                    type="text"
                    control={control}
                    name="region"
                    label="Estado"
                    className="col-span-2"
                    error={errors.region}
                    placeholder="Enter your state or province"
                  />

                  <div className="col-span-full">
                    <label
                      htmlFor="about"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Sobre você
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="about"
                        {...register("about")}
                        rows={3}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                        defaultValue={""}
                      />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      Descreva um pouco sobre você abaixo
                    </p>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="photo"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Foto de perfil
                    </label>
                    <div className="mt-2 flex items-center gap-x-3">
                      {profileImageUrl || profileImage ? (
                        <Image
                          width={48}
                          height={48}
                          src={
                            profileImageUrl
                              ? profileImageUrl
                              : URL.createObjectURL(profileImage)
                          }
                          alt="Profile"
                          className="h-12 w-12 rounded-full"
                        />
                      ) : (
                        <UserCircleIcon
                          className="h-12 w-12 text-gray-300"
                          aria-hidden="true"
                        />
                      )}
                      <label
                        htmlFor="profile-image"
                        className="cursor-pointer rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        Fazer upload de arquivo
                        <input
                          id="profile-image"
                          name="profile-image"
                          type="file"
                          onChange={(e) =>
                            handleImageChange(
                              e,
                              setProfileImage,
                              setProfileImageUrl
                            )
                          }
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="cover-photo"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Foto de capa
                    </label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                      <div className="text-center">
                        <PhotoIcon
                          className="mx-auto h-12 w-12 text-gray-300"
                          aria-hidden="true"
                        />
                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:primary focus-within:ring-offset-2 hover:text-secondary"
                          >
                            <span>Fazer upload de arquivo</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                            />
                          </label>
                        </div>
                        <p className="text-xs leading-5 text-gray-600">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end pr-8">
                <button
                  type="submit"
                  className="w-64 rounded-md bg-primary text-white font-semibold px-4 py-2.5 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileForm;
