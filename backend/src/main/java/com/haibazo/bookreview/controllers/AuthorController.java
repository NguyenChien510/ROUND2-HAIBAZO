package com.haibazo.bookreview.controllers;

import com.haibazo.bookreview.entities.Author;
import com.haibazo.bookreview.repositories.AuthorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/authors")
public class AuthorController {

    @Autowired
    private AuthorRepository authorRepository;

    @GetMapping
    public List<AuthorResponse> getAllAuthors() {
        return authorRepository.findAll().stream().map(author -> {
            int bookCount = author.getBooks() != null ? author.getBooks().size() : 0;
            return new AuthorResponse(author.getId(), author.getName(), bookCount);
        }).collect(Collectors.toList());
    }

    @PostMapping
    public Author createAuthor(@RequestBody Author author) {
        return authorRepository.save(author);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Author> updateAuthor(@PathVariable Long id, @RequestBody Author authorDetails) {
        return authorRepository.findById(id)
                .map(author -> {
                    author.setName(authorDetails.getName());
                    return ResponseEntity.ok(authorRepository.save(author));
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAuthor(@PathVariable Long id) {
        return authorRepository.findById(id)
                .map(author -> {
                    authorRepository.delete(author);
                    return ResponseEntity.ok().<Void>build();
                }).orElse(ResponseEntity.notFound().build());
    }

    // Helper DTO
    public static class AuthorResponse {
        private Long id;
        private String name;
        private int bookCount;

        public AuthorResponse(Long id, String name, int bookCount) {
            this.id = id;
            this.name = name;
            this.bookCount = bookCount;
        }

        public Long getId() { return id; }
        public String getName() { return name; }
        public int getBookCount() { return bookCount; }
    }
}
