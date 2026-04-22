package com.haibazo.bookreview.controllers;

import com.haibazo.bookreview.entities.Book;
import com.haibazo.bookreview.entities.Review;
import com.haibazo.bookreview.repositories.BookRepository;
import com.haibazo.bookreview.repositories.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private BookRepository bookRepository;

    @GetMapping
    public List<ReviewResponse> getAllReviews() {
        return reviewRepository.findAll().stream().map(review -> 
            new ReviewResponse(review.getId(), review.getBookTitle(), review.getAuthorName(), review.getContent())
        ).collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody ReviewRequest reviewRequest) {
        return bookRepository.findById(reviewRequest.getBookId())
                .map(book -> {
                    Review review = new Review();
                    review.setContent(reviewRequest.getContent());
                    review.setBook(book);
                    return ResponseEntity.ok(reviewRepository.save(review));
                }).orElse(ResponseEntity.badRequest().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        return reviewRepository.findById(id).map(review -> {
            reviewRepository.delete(review);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // Helper DTOs
    public static class ReviewResponse {
        public Long id;
        public String bookTitle;
        public String authorName;
        public String content;
        public ReviewResponse(Long id, String bookTitle, String authorName, String content) {
            this.id = id; this.bookTitle = bookTitle; this.authorName = authorName; this.content = content;
        }
    }

    public static class ReviewRequest {
        private String content;
        private Long bookId;
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public Long getBookId() { return bookId; }
        public void setBookId(Long bookId) { this.bookId = bookId; }
    }
}
