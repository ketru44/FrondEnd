import Icon from "../Icon";
import { GoChevronRight } from "react-icons/go";
import { Palette } from "@/styles/Palette";
import styled from "styled-components";

/**
 *
 * @param {string} content
 * @param {number} number
 * @param {function(): void} onClick
 * @returns {JSX.Element}
 */
interface MypageMainLiProps {
  content: string;
  number?: number;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
}
const MypageMainLi: React.FC<MypageMainLiProps> = ({
  content,
  number,
  onClick,
}) => {
  return (
    <DivLi onClick={onClick}>
      <li>
        {content} {number !== undefined && <span>({number})</span>}
      </li>
      <Icon size="24px" color={Palette["point_blue"]}>
        <GoChevronRight />
      </Icon>
    </DivLi>
  );
};

const DivLi = styled.div`
  text-align: start;
  height: 68px;
  border-bottom: 2px solid #f3f2f3;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 44px;
  padding-right: 20px;
  cursor: pointer;
  &:hover {
    background-color: ${Palette.percent_gray};
  }

  li span {
    color: ${Palette["point_blue"]};
  }
  Icon {
    position: relative;
    right: 0;
  }
`;

export default MypageMainLi;
