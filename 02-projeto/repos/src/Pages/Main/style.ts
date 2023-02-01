import styled from "styled-components";

export const Container = styled.div`
  max-width: 700px;
  background-color: #fff;
  border-radius: 4px;

  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  padding: 30px;
  margin: 80px auto;

  h1 {
    display: flex;
    font-size: 20px;
    flex-direction: row;
    align-items: center;

    gap: 1rem;
  }
`;

export const Form = styled.form`
  margin-top: 30px;

  display: flex;
  flex-direction: row;
  gap: 0.5rem;

  input {
    flex: 1;
    border: 1px solid #ddd;
    padding: 10px 15px;
    border-radius: 4px;

    font-size: 17px;
  }
`;

export const SubmitButton = styled.button.attrs({
  type: "submit",
})`
  background: #0d2636;
  border: 0;
  border-radius: 4px;

  padding: 0 15px;

  display: flex;
  justify-content: center;
  align-items: center;

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
