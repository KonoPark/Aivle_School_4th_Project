package com.aivle0102.book.repository;

import com.aivle0102.book.domain.ImgInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImgInfoRepository extends JpaRepository<ImgInfo, Long> {
}
