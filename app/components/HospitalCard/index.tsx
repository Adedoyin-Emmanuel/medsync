import { useGetHospitalRatingQuery } from "@/app/store/slices/user.slice";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsStar, BsStarFill } from "react-icons/bs";
import Text from "../Text";
import Verified from "../Verified";

interface HospitalCardProps {
  className?: string;
  clinicName: string;
  address: string;
  isVerified: boolean;
  _id: string;
  href: string;
}

interface UserCardProps {
  className?: string;
  name: string;
  address: string;
  isVerified: boolean;
  _id?: string;
  bio: string;
  href: string;
}

const HospitalCard = ({
  className,
  clinicName,
  address,
  isVerified,
  _id,
  href,
}: HospitalCardProps) => {
  const stars = Array(5).fill(null);
  const [rating, setRating] = useState(0);

  const { data } = useGetHospitalRatingQuery(_id);

  useEffect(() => {
    if (data) {
      setRating(data.data.rating);
    }
  }, [data]);

  // map the stars based on the hospital rating
  const starElements = stars.map((_, index) => (
    <React.Fragment key={index}>
      {index < rating ? (
        <BsStarFill className="h-5 w-5 text-yellow-500" />
      ) : (
        <BsStar className="h-5 w-5" />
      )}
    </React.Fragment>
  ));

  return (
    <Link href={href}>
      <section
        className={`hospital bg-gray-100 transition-colors duration-100 ease-in hover:bg-purple-100 p-3 rounded md:w-96 cursor-pointer ${className}`}
      >
        <h2 className="font-bold capitalize flex items-center gap-x-1">
          {clinicName}
          <span>{isVerified && <Verified />}</span>
        </h2>
        <Text className="text-sm">{address}</Text>
        <section className="rating flex gap-x-1 my-2">{starElements}</section>
      </section>
    </Link>
  );
};

export const UserCard = ({
  className,
  name,
  address,
  isVerified,
  _id,
  href,
  bio,
}: UserCardProps) => {
  return (
    <Link href={href}>
      <section
        className={`hospital bg-gray-100 transition-colors duration-100 ease-in hover:bg-purple-100 p-3 rounded md:w-96 cursor-pointer ${className}`}
      >
        <h2 className="font-bold capitalize flex items-center gap-x-1">
          {name}
          <span>{isVerified && <Verified />}</span>
        </h2>
        <Text className="text-sm">{address}</Text>
        <Text className="my-1 text-sm capitalize"> {bio}</Text>
      </section>
    </Link>
  );
};

export default HospitalCard;
