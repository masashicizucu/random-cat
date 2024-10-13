import { useEffect, useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import styles from "./index.module.css";

const IndexPage: NextPage<Props> = ({ initialImageUrl }) => {
    const [imageUrl, setImageUrl] = useState(initialImageUrl); // 初期値を渡す
    const [loading, setLoading] = useState(false); // 初期状態はfalseにしておく
    // ❷ マウント時に画像を読み込む宣言
    useEffect(() => {
        fetchImage().then((newImage) => {
            setImageUrl(newImage.url); // 画像URLの状態を更新する
            setLoading(false); // ローディング状態を更新する
        });
    }, []);
    // ボタンをクリックしたときに画像を読み込む処理
    const handleClick = async () => {
        setLoading(true); // 読込中フラグを立てる
        const newImage = await fetchImage();
        setImageUrl(newImage.url); // 画像URLの状態を更新する
        setLoading(false); // 読込中フラグを倒す
    };
    return (
        <div className={styles.page}>
            <button onClick={handleClick} className={styles.button}>
                one more cat!
            </button>
            <div className={styles.frame}>
                {loading || <img src={imageUrl} className={styles.img}/>}</div>
        </div>
    );
    // ❸ ローディング中でなければ、画像を表示する
};
export default IndexPage;

export const getServerSideProps: GetServerSideProps<Props> = async () => {
    const image = await fetchImage();
    return {
        props: {
            initialImageUrl: image.url,
        },
    };
};

type Props = {
    initialImageUrl: string; 
};

type Image = {
    url: string;
};
const fetchImage = async (): Promise<Image> => {
    //                       ^^^^^^^^^^^^^^^^型注釈
    const res = await fetch("https://api.thecatapi.com/v1/images/search");
    const images = await res.json();
    console.log(images);
    return images[0];
};


