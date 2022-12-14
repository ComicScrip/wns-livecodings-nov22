import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { getOneWilder } from "../services/wilders";
import { IWilder } from "../types/IWilder";
import blank_profile from "../assets/avatar.png";
import Skill from "../components/Skill";

export default function WilderDetails() {
  const { id } = useParams();

  const [wilder, setWilder] = useState<IWilder>();
  useEffect(() => {
    if (id) getOneWilder(parseInt(id, 10)).then(setWilder).catch(console.error);
  }, [id]);

  if (!wilder) return <Loader />;

  const { avatarUrl, name, skills, city, bio } = wilder;

  return (
    <div className="p-4 pt-10 pb-10 flex flex-col items-center ">
      <>
        <div className="flex flex-col items-center">
          <img
            src={avatarUrl || blank_profile}
            alt={name}
            className="h-[50vw] w-[50vw] max-w-[300px] max-h-[300px] rounded-full mr-4 border-white border-[5px] shadow-md"
          />
          <h1 className="text-3xl pt-4 text-center font-semibold">{name}</h1>
          {city && <p className="text-center text-gray italic">from {city}</p>}
          <ul className="flex flex-wrap justify-center mt-8 mb-8">
            {skills.map((skill, index) => (
              <Skill
                key={index}
                title={skill.name}
                wilderId={wilder.id}
                skillId={skill.id}
                votes={skill.votes}
              />
            ))}
          </ul>
          {bio && <p className="text-justify">{bio}</p>}
        </div>
        <Link to={"edit"}>
          <button className="mt-8">Edit</button>
        </Link>
      </>
    </div>
  );
}
