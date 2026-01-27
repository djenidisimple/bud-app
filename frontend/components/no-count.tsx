type Count = {
    setCount:  React.Dispatch<React.SetStateAction<number>>;
    count: number;
}
export default function NoCount({ setCount, count } : Count) {
    setCount(count + 1)
}