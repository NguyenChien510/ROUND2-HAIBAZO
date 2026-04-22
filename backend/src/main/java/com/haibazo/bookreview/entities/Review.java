package com.haibazo.bookreview.entities;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    @JsonIgnore
    private Book book;

    public Review() {}

    public Review(Long id, String content, Book book) {
        this.id = id;
        this.content = content;
        this.book = book;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Book getBook() { return book; }
    public void setBook(Book book) { this.book = book; }

    @Transient
    public String getBookTitle() {
        return book != null ? book.getTitle() : "Unknown";
    }

    @Transient
    public String getAuthorName() {
        return (book != null && book.getAuthor() != null) ? book.getAuthor().getName() : "Unknown";
    }
}
