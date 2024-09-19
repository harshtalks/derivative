"use client";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/cradenza";
import useInvoiceEditor from "../use-invoice-editor";
import { BubbleMenuBtn } from "./bubble-menu";
import { Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useReducer, useState } from "react";
import { toast } from "sonner";
import { useSelector } from "@xstate/store/react";
import imageStore from "../image-store";
import Image from "next/image";

const ImageLoader = () => {
  const { editor } = useInvoiceEditor();
  const { url, open } = useSelector(imageStore, (state) => state.context);

  // create a reducer with url and alt text
  const [value, setValue] = useState("");
  const [alt, setAlt] = useState("");

  return (
    <Credenza
      open={open}
      onOpenChange={(value) =>
        imageStore.send({
          type: "toggleOpen",
          value: value,
        })
      }
    >
      <CredenzaTrigger asChild>
        <BubbleMenuBtn active={false}>
          <ImageIcon className="shrink-0 size-4" />
        </BubbleMenuBtn>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Add Image</CredenzaTitle>
          <CredenzaDescription>
            Add image to the markup by submitting url from the web. We do not
            support uploading images from your device as of now but it is in our
            roadmap.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Remote Image Url"
            />
            <Input
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Add Alt Text"
            />
          </div>
          <div className="w-[200px] shrink-0 mx-auto h-[200px] relative">
            <img
              src={value ? value : "https://placehold.co/200"}
              alt={alt}
              className="w-full h-full absolute inset-0 object-cover"
            />
          </div>
        </CredenzaBody>
        <CredenzaFooter>
          <Button
            onClick={() => {
              if (value) {
                imageStore.send({
                  url: value,
                  type: "setImageUrl",
                  alt: alt,
                });
                imageStore.send({
                  type: "toggleOpen",
                  value: false,
                });
                setValue("");
              } else {
                toast.error("Please provide a valid image url");
              }
            }}
          >
            Submit
          </Button>
          <CredenzaClose asChild>
            <button>Close</button>
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};

export default ImageLoader;
