"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Box, Typography, Stack, CardMedia, Pagination } from "@mui/material";

export default function MainPage() {
    const [books, setBooks] = useState([]); // 전체 작품 데이터
    const [page, setPage] = useState(1);    // 현재 페이지
    const itemsPerPage = 4;                 // 한 페이지당 4개

    // ---------- 1) 백엔드에서 데이터 가져오기 ----------
    useEffect(() => {
        fetch("http://localhost:8080/book/list")
            .then((res) => res.json())
            .then((data) => {
                console.log("📘 불러온 데이터:", data);

                // 최신 등록순 정렬
                const sorted = data.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );

                setBooks(sorted);
            })
            .catch((err) => console.error("도서 불러오기 오류:", err));
    }, []);

    // ---------- 2) 페이지네이션 ----------
    const startIndex = (page - 1) * itemsPerPage;
    const currentItems = books.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(books.length / itemsPerPage);

    return (
        <Box sx={{ width: "100%", mt: 5 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, ml: 2 }}>
                작품 목록
            </Typography>

            {/* ---------- 3) 작품 리스트 렌더링 ---------- */}
            <Stack spacing={4} sx={{ px: 2 }}>
                {currentItems.map((item) => (
                    <Link
                        key={item.bookId}
                        href={`/books/${item.bookId}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 3,
                                alignItems: "center",
                                p: 2,
                                borderRadius: 2,
                                backgroundColor: "#f8f4f2",
                                transition: "transform 0.2s",
                                cursor: "pointer",
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                    boxShadow: 3,
                                },
                            }}
                        >
                            {/* ---------- 이미지 ---------- */}
                            {item.coverImageUrl ? (
                                <CardMedia
                                    component="img"
                                    image={item.coverImageUrl}
                                    alt={item.title}
                                    sx={{
                                        width: 130,
                                        height: 190,
                                        borderRadius: 2,
                                        objectFit: "cover",
                                    }}
                                />
                            ) : (
                                <Box
                                    sx={{
                                        width: 130,
                                        height: 190,
                                        borderRadius: 2,
                                        backgroundColor: "#e0e0e0",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        color: "#777",
                                    }}
                                >
                                    이미지 없음
                                </Box>
                            )}

                            {/* ---------- 제목 + 내용 ---------- */}
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                    {item.title}
                                </Typography>

                                <Typography sx={{ color: "#555", lineHeight: 1.5 }}>
                                    {item.content?.slice(0, 80) || "내용 없음"}...
                                </Typography>
                            </Box>
                        </Box>
                    </Link>
                ))}
            </Stack>

            {/* ---------- 4) 페이지네이션 ---------- */}
            <Stack alignItems="center" sx={{ mt: 4 }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(e, v) => setPage(v)}
                    color="primary"
                    shape="rounded"
                />
            </Stack>
        </Box>
    );
}
