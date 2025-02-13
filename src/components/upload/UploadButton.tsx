import styled from "styled-components";
import { Palette } from "@/styles/Palette";
import { useRecoilState, useResetRecoilState } from "recoil";
import { uploadSelector } from "@/utils/UploadAtom";
import { useEffect, useState } from "react";
import { uploadVote } from "@/services/vote";
import { useMutation } from "@tanstack/react-query";
import routes from "@/routes";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const UploadButton = () => {
  const navigate = useNavigate();
  const [count, setCount] = useRecoilState<any>(uploadSelector);
  const resetList = useResetRecoilState(uploadSelector);
  const [active, setActive] = useState(false);
  const [doOnce, setDoOnce] = useState(true);
  const mutation = useMutation({
    mutationFn: (payload: number) => uploadVote(payload),
  });
  useEffect(() => {
    if (!!count.title && count.options.length > 1) {
      const act = count.options.filter((item: any) => {
        return item.name === "" && item.image === "";
      });
      setActive(Number(!act.length) > 0);
    }
    if (count.options.length < 2 || !count.title) {
      setActive(false);
    }
  }, [count]);

  const uploadButton = async () => {
    if (active && doOnce) {
      setDoOnce(false);
      const payload = count;
      await mutation.mutate(payload, {
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            text: "업로드 완료",
          }).then(() => {
            resetList();
            navigate(routes.home);
            location.reload();
          });
          navigate(routes.home);
          setDoOnce(true);
        },
        onError: (error: any) => {
          alert(error?.data.message);
        },
      });
    }
  };

  return (
    <>
      <UploadButtonStyle active={active}>
        <button className="uploadBtn" onClick={uploadButton}>
          등록
        </button>
      </UploadButtonStyle>
    </>
  );
};

const UploadButtonStyle = styled.div<{ active: boolean }>`
  .uploadBtn {
    background-color: ${(prop) =>
      prop.active ? Palette["button_blue"] : Palette["percent_gray"]};
    color: ${(prop) => (prop.active ? "#FFFFFF" : "#000000")};
    width: 100%;
    max-width: 450px;
    height: 60px;
    font-size: 19px;
    border: 0;
  }
  display: flex;
  width: 100%;
  max-width: 450px;
  flex-direction: column;
  position: fixed;
  bottom: 0;
  z-index: 100000;
`;

export default UploadButton;
