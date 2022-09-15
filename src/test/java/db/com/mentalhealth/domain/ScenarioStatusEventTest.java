package db.com.mentalhealth.domain;

import static org.assertj.core.api.Assertions.assertThat;

import db.com.mentalhealth.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ScenarioStatusEventTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ScenarioStatusEvent.class);
        ScenarioStatusEvent scenarioStatusEvent1 = new ScenarioStatusEvent();
        scenarioStatusEvent1.setId(1L);
        ScenarioStatusEvent scenarioStatusEvent2 = new ScenarioStatusEvent();
        scenarioStatusEvent2.setId(scenarioStatusEvent1.getId());
        assertThat(scenarioStatusEvent1).isEqualTo(scenarioStatusEvent2);
        scenarioStatusEvent2.setId(2L);
        assertThat(scenarioStatusEvent1).isNotEqualTo(scenarioStatusEvent2);
        scenarioStatusEvent1.setId(null);
        assertThat(scenarioStatusEvent1).isNotEqualTo(scenarioStatusEvent2);
    }
}
