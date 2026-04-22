package com.haibazo.bookreview.controllers;

import com.haibazo.bookreview.entities.Author;
import com.haibazo.bookreview.entities.Book;
import com.haibazo.bookreview.repositories.AuthorRepository;
import com.haibazo.bookreview.repositories.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/books")
public class BookController {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private AuthorRepository authorRepository;

    @GetMapping
    public List<BookResponse> getAllBooks() {
        return bookRepository.findAll().stream().map(book -> 
            new BookResponse(book.getId(), book.getTitle(), book.getAuthorName(), book.getAuthor() != null ? book.getAuthor().getId() : null)
        ).collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<Book> createBook(@RequestBody BookRequest bookRequest) {
        return authorRepository.findById(bookRequest.getAuthorId())
                .map(author -> {
                    Book book = new Book();
                    book.setTitle(bookRequest.getTitle());
                    book.setAuthor(author);
                    return ResponseEntity.ok(bookRepository.save(book));
                }).orElse(ResponseEntity.badRequest().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody BookRequest bookRequest) {
        return bookRepository.findById(id).flatMap(book -> 
            authorRepository.findById(bookRequest.getAuthorId()).map(author -> {
                book.setTitle(bookRequest.getTitle());
                book.setAuthor(author);
                return ResponseEntity.ok(bookRepository.save(book));
            })
        ).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        return bookRepository.findById(id).map(book -> {
            bookRepository.delete(book);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // Helper DTOs
    public static class BookResponse {
        public Long id;
        public String title;
        public String authorName;
        public Long authorId;
        public BookResponse(Long id, String title, String authorName, Long authorId) {
            this.id = id; this.title = title; this.authorName = authorName; this.authorId = authorId;
        }
    }

    public static class BookRequest {
        private String title;
        private Long authorId;
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public Long getAuthorId() { return authorId; }
        public void setAuthorId(Long authorId) { this.authorId = authorId; }
    }
}
