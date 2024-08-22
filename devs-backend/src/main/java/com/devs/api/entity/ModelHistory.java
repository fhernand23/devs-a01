package com.devs.api.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "models_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ModelHistory extends History {
    @ManyToOne
    @JoinColumn(name = "model_id")
    private Model model;
}