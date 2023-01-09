import clsx from "clsx";
import React from "react";
import Loader from "../components/Loader";
import Wilder from "../components/Wilder";
import WilderForm from "../components/WilderForm";
import { IWilder } from "../types/IWilder";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useQuery, gql } from "@apollo/client";

const GET_WILDERS = gql`
  query WilderList {
    wilders {
      id
      name
      skills {
        id
        name
        votes
      }
    }
  }
`;

export default function Home() {
  const [parent] = useAutoAnimate<HTMLUListElement>();
  const { loading: loadingWilders, data, refetch } = useQuery(GET_WILDERS);
  const wilders: IWilder[] = data?.wilders || [];

  return (
    <div>
      <WilderForm onWilderCreated={refetch} />
      <ul
        ref={parent}
        className={clsx(
          loadingWilders && "opacity-90 transition-opacity duration-500"
        )}
      >
        {loadingWilders && !wilders.length ? (
          <Loader />
        ) : (
          wilders
            .slice()
            .sort((a, b) => b.id - a.id)
            .map((wilder) => (
              <Wilder key={wilder.id} setWilders={() => {}} wilder={wilder} />
            ))
        )}
      </ul>
    </div>
  );
}
