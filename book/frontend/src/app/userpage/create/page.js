"use client";

import { useEffect, useState } from "react";
import {
    Grid,
    TextField,
    Typography,
    Button,
    MenuItem,
    Box,
    Card,
    CardMedia,
    FormControl,
    InputLabel,
    Select
} from "@mui/material";

export default function CreateWork() {

    /* ------------------------------
        🧩 로그인 체크
    ------------------------------ */
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.userId) {
            alert("로그인 후 이용 가능합니다.");
            window.location.href = "/login";
        }
    }, []);

    /* ------------------------------
        🧩 상태값 관리
    ------------------------------ */
    const [form, setForm] = useState({
        title: "",
        author: "",
        category: "",
        content: "",
    });

    const [userApiKey, setUserApiKey] = useState("");
    const [model, setModel] = useState("dall-e-3");
    const [imageUrl, setImageUrl] = useState(null);
    const [isGeneratingCover, setIsGeneratingCover] = useState(false);

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleModelChange = (e) => {
        setModel(e.target.value);
    };

    /* ============================================================
        ⭐ 표지 이미지 생성
        (React → Next.js API Route → OpenAI)
    ============================================================ */
    const handleGenerateCover = async () => {
        if (!userApiKey) {
            alert("OpenAI API Key를 입력해주세요.");
            return;
        }
        if (!form.title || !form.content) {
            alert("제목과 내용을 입력해야 표지를 생성할 수 있습니다.");
            return;
        }

        setIsGeneratingCover(true);

        try {
            const prompt = `
            '${form.category}' 장르의 동화책 표지를 그려줘.
            제목: ${form.title}
            작가: ${form.author}
            내용 설명: ${form.content}
            따뜻하고 밝은 분위기의 일러스트 스타일로.
            `;

            const response = await fetch("/api/generateCover", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    apiKey: userApiKey,
                    model: "dall-e-3",
                    prompt,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "이미지 생성 실패");
            }

            const url = result.data[0].url;
            setImageUrl(url);

            alert("표지 이미지 생성 완료!");

        } catch (err) {
            console.error("이미지 생성 실패:", err);
            alert(err.message);
        } finally {
            setIsGeneratingCover(false);
        }
    };

    /* ============================================================
        ⭐ 작품 등록
        (React → Spring Boot multipart/form-data)
        ※ 파일 없이 이미지 URL만 전송!
    ============================================================ */
    const handleSubmit = async () => {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (!userData?.userId) {
            alert("로그인 정보가 유효하지 않습니다.");
            window.location.href = "/login";
            return;
        }

        if (!form.title || !form.content) {
            alert("필수 항목을 입력해주세요.");
            return;
        }

        try {
            const formData = new FormData();

            // JSON을 Blob으로 감싸서 multipart 로 보냄
            formData.append(
                "book",
                new Blob(
                    [
                        JSON.stringify({
                            title: form.title,
                            author: form.author,
                            category: form.category,
                            content: form.content,
                            coverImageUrl: imageUrl,  // ⭐ AI url 저장
                        }),
                    ],
                    { type: "application/json" }
                )
            );

            // 파일은 없음 → null 전송
            formData.append("file", new Blob([], { type: "application/octet-stream" }));

            // userId 전달
            formData.append("userId", userData.userId);

            const response = await fetch("http://localhost:8080/book/insert", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const err = await response.text();
                console.error("등록 실패:", err);
                alert("등록 실패: 서버 로그 확인 필요");
                return;
            }

            alert("작품 등록 완료!");
            window.location.href = "/mainpage";

        } catch (err) {
            console.error("등록 오류:", err);
            alert("등록 중 오류가 발생했습니다.");
        }
    };

    /* ============================================================
        ⭐ UI 렌더링
    ============================================================ */
    return (
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%", mt: 5 }}>
            <Grid container spacing={4} sx={{ maxWidth: "1200px", px: 2 }}>

                {/* 왼쪽 - 입력 */}
                <Grid item xs={12} md={4}>
                    <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
                        새 작품 등록
                    </Typography>

                    <TextField label="작품 제목" name="title" fullWidth sx={{ mb: 3 }}
                               value={form.title} onChange={handleFormChange} />

                    <TextField label="작가명" name="author" fullWidth sx={{ mb: 3 }}
                               value={form.author} onChange={handleFormChange} />

                    <TextField label="카테고리" name="category" fullWidth sx={{ mb: 3 }}
                               value={form.category} onChange={handleFormChange} />

                    <TextField label="내용" name="content" fullWidth multiline minRows={6}
                               sx={{ mb: 3 }} value={form.content} onChange={handleFormChange} />
                </Grid>

                {/* 오른쪽 - 표지 생성 */}
                <Grid item xs={12} md={4}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                        표지 이미지 생성
                    </Typography>

                    <TextField
                        type="password"
                        label="OpenAI API Key"
                        placeholder="sk-xxxx"
                        fullWidth sx={{ mb: 3 }}
                        value={userApiKey}
                        onChange={(e) => setUserApiKey(e.target.value)}
                    />

                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel id="model-select-label">이미지 모델</InputLabel>
                        <Select
                            labelId="model-select-label"
                            value={model}
                            label="이미지 모델"
                            onChange={handleModelChange}
                        >
                            <MenuItem value="dall-e-3">DALL·E 3</MenuItem>
                        </Select>
                    </FormControl>

                    <Button
                        variant="outlined"
                        size="large"
                        onClick={handleGenerateCover}
                        disabled={isGeneratingCover}
                    >
                        {isGeneratingCover ? "생성 중..." : "이미지 생성하기"}
                    </Button>

                    <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600 }}>
                        생성 결과
                    </Typography>

                    {imageUrl ? (
                        <Card sx={{ maxWidth: 300 }}>
                            <CardMedia component="img" src={imageUrl} />
                        </Card>
                    ) : (
                        <Box sx={{
                            width: 300,
                            height: 300,
                            backgroundColor: "#eee",
                            borderRadius: 2,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "#999"
                        }}>
                            이미지 없음
                        </Box>
                    )}

                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleSubmit}
                        sx={{ mt: 3 }}
                    >
                        작품 등록하기
                    </Button>
                </Grid>

            </Grid>
        </Box>
    );
}
