import { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export const SearchBuildingCreate = (): ReactNode => {
  const navigate = useNavigate();
  return (
    <div>
      <p>SearchBuildingCreate</p>
      <button onClick={() => navigate(-1)}>돌아가기</button>
    </div>
  );
};
