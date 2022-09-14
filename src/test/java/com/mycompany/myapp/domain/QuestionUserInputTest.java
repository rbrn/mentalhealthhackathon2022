package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class QuestionUserInputTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(QuestionUserInput.class);
        QuestionUserInput questionUserInput1 = new QuestionUserInput();
        questionUserInput1.setId(1L);
        QuestionUserInput questionUserInput2 = new QuestionUserInput();
        questionUserInput2.setId(questionUserInput1.getId());
        assertThat(questionUserInput1).isEqualTo(questionUserInput2);
        questionUserInput2.setId(2L);
        assertThat(questionUserInput1).isNotEqualTo(questionUserInput2);
        questionUserInput1.setId(null);
        assertThat(questionUserInput1).isNotEqualTo(questionUserInput2);
    }
}
